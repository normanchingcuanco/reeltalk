// backend/controllers/movieController.js

const Movie = require("../models/Movie")
const User = require("../models/User")
const axios = require("axios")
const mongoose = require("mongoose")

// ===============================
// Helpers
// ===============================

// Builds nested/threaded comment structure from a flat list
const buildThreadedComments = (comments) => {
  const map = new Map()
  const roots = []

  const cloned = comments.map((c) => {
    const obj = typeof c.toObject === "function" ? c.toObject() : { ...c }
    obj.replies = []
    return obj
  })

  for (const c of cloned) {
    map.set(String(c._id), c)
  }

  for (const c of cloned) {
    if (c.parentCommentId) {
      const parent = map.get(String(c.parentCommentId))
      if (parent) parent.replies.push(c)
      else roots.push(c)
    } else {
      roots.push(c)
    }
  }

  return roots
}

// Collect all descendant comment IDs for cascade delete (parent + children + deeper)
const collectDescendants = (comments, parentId) => {
  const childrenByParent = new Map()

  for (const c of comments) {
    const p = c.parentCommentId ? String(c.parentCommentId) : null
    if (!childrenByParent.has(p)) childrenByParent.set(p, [])
    childrenByParent.get(p).push(String(c._id))
  }

  const ids = []
  const stack = [String(parentId)]

  while (stack.length) {
    const current = stack.pop()
    ids.push(current)

    const kids = childrenByParent.get(current) || []
    for (const kid of kids) stack.push(kid)
  }

  return ids
}

// Safe numeric parse
const toNumber = (value, fallback) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

// ===============================
// ADD MOVIE (AUTO OMDb FETCH) - logged-in users
// ===============================
exports.addMovie = async (req, res) => {
  try {
    const { title } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Movie title is required." })
    }

    if (!process.env.OMDB_API_KEY) {
      console.log("ADD MOVIE ERROR >>> OMDB_API_KEY missing in environment")
      return res.status(500).json({ message: "OMDB_API_KEY is not set on the server." })
    }

    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(
      title.trim()
    )}&apikey=${process.env.OMDB_API_KEY}`

    const omdbRes = await axios.get(url)

    if (!omdbRes?.data) {
      console.log("ADD MOVIE ERROR >>> No data from OMDb")
      return res.status(500).json({ message: "No response from OMDb." })
    }

    if (omdbRes.data.Response === "False") {
      return res.status(404).json({
        message: omdbRes.data.Error || "Movie not found in OMDb."
      })
    }

    const data = omdbRes.data
    const parsedYear = parseInt(data.Year, 10)
    const year = Number.isFinite(parsedYear) ? parsedYear : null

    let posterUrl = null

    // Ignore unreliable Amazon posters from OMDb
    if (data.Poster && data.Poster !== "N/A" && !data.Poster.includes("amazon")) {
      posterUrl = data.Poster
    }

    // 🔥 TMDb fallback if poster missing or unreliable
    if (!posterUrl && process.env.TMDB_API_KEY) {
      try {
        const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(data.Title)}`

        const tmdbRes = await axios.get(tmdbUrl)

        const posterPath = tmdbRes?.data?.results?.[0]?.poster_path

        if (posterPath) {
          posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`
        }

      } catch (err) {
        console.log("TMDB FALLBACK ERROR >>>", err.message)
      }
    }

    const created = await Movie.create({
      title: data.Title.trim(),
      director: data.Director,
      year,
      description: data.Plot,
      genre: data.Genre,
      posterUrl,
      createdBy: req.user.id
    })

    return res.status(201).json({
      message: "Movie added successfully",
      movie: created
    })

  } catch (error) {
    console.log("ADD MOVIE ERROR >>>", error?.message)

    // ✅ Proper duplicate key handling (Mongo unique index)
    if (error?.code === 11000) {
      return res.status(400).json({
        message: "Movie already exists (same title and year)."
      })
    }

    const msg =
      error?.response?.data?.Error ||
      error?.response?.data?.message ||
      error?.message ||
      "Server error"

    return res.status(500).json({ message: msg })
  }
}

// ===============================
// GET ALL MOVIES (SEARCH + FILTER + PAGINATION + SORT)
// ===============================
exports.getMovies = async (req, res) => {
  try {
    const search = (req.query.search || "").trim()
    const genre = (req.query.genre || "").trim()
    const page = Math.max(1, toNumber(req.query.page, 1))
    const limit = Math.min(50, Math.max(1, toNumber(req.query.limit, 10)))
    const sort = (req.query.sort || "").trim()

    const query = {}

    if (search) {
      query.title = { $regex: search, $options: "i" }
    }

    if (genre) {
      query.genre = { $regex: genre, $options: "i" }
    }

    const skip = (page - 1) * limit

    let sortOption = {}

    // ================= DB SORTING (Title A-Z + Newest) =================
    if (sort === "titleAsc") {
      sortOption = { title: 1 }
    } else if (!sort) {
      sortOption = { createdAt: -1 } // default newest
    }

    let movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)

    // ================= MEMORY SORTING (Computed Fields) =================
    if (sort === "highestRated") {
      movies = movies.sort((a, b) =>
        (b.averageRating || 0) - (a.averageRating || 0)
      )
    }
    else if (sort === "mostLiked") {
      movies = movies.sort((a, b) =>
        (b.likes?.length || 0) - (a.likes?.length || 0)
      )
    }

    else if (sort === "mostViewed") {
      movies = movies.sort((a, b) =>
        (b.views || 0) - (a.views || 0)
      )
    }
    
    else if (sort === "trending") {

      movies = movies.sort((a, b) => {

        const scoreA =
          ((a.likes?.length || 0) * 2) +
          (a.comments?.length || 0) +
          ((a.averageRating || 0) * 2)

        const scoreB =
          ((b.likes?.length || 0) * 2) +
          (b.comments?.length || 0) +
          ((b.averageRating || 0) * 2)

        return scoreB - scoreA
      })

    }

    const total = await Movie.countDocuments(query)

    return res.status(200).json({
      totalResults: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      movies
    })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// GET SINGLE MOVIE
// ===============================
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    // 🔥 Increment view count every time movie page is opened
    movie.views += 1
    await movie.save()

    return res.status(200).json({ movie })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// UPDATE MOVIE (CREATOR OR ADMIN)
// ===============================
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    const isOwner = String(movie.createdBy) === String(req.user.id)
    const isAdmin = req.user.isAdmin === true

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    Object.assign(movie, req.body)
    await movie.save()

    return res.status(200).json({ message: "Movie updated successfully", movie })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Movie already exists (same title and year)." })
    }
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// DELETE MOVIE (CREATOR OR ADMIN)
// ===============================
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    const isOwner = String(movie.createdBy) === String(req.user.id)
    const isAdmin = req.user.isAdmin === true

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await Movie.findByIdAndDelete(req.params.id)

    return res.status(200).json({ message: "Movie deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// LIKE / UNLIKE MOVIE (TOGGLE)
// ===============================
exports.toggleLikeMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    const userId = req.user.id
    const alreadyLiked = movie.likes.some((id) => String(id) === String(userId))

    if (alreadyLiked) {
      movie.likes = movie.likes.filter((id) => String(id) !== String(userId))
    } else {
      movie.likes.push(userId)
    }

    await movie.save()

    return res.status(200).json({
      message: alreadyLiked ? "Movie unliked" : "Movie liked",
      totalLikes: movie.likes.length
    })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// RATE MOVIE (1-5)
// ===============================
exports.rateMovie = async (req, res) => {
  try {
    const value = toNumber(req.body.value, 0)
    const movieId = req.params.id
    const userId = req.user.id

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    const movie = await Movie.findById(movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const existing = movie.ratings.find((r) => String(r.userId) === String(userId))

    if (existing) {
      existing.value = value
    } else {
      movie.ratings.push({ userId, value })
    }

    const total = movie.ratings.reduce((sum, r) => sum + (r.value || 0), 0)
    movie.averageRating = movie.ratings.length ? total / movie.ratings.length : 0

    await movie.save()

    return res.status(200).json({
      message: "Rating submitted",
      averageRating: Number(movie.averageRating.toFixed(2)),
      totalRatings: movie.ratings.length
    })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// GET COMMENTS (THREADED + PAGINATION)
// ===============================
exports.getComments = async (req, res) => {
  try {

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10))

    const movie = await Movie.findById(req.params.id)
      .populate("comments.userId", "username")

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    // Build threaded structure first
    const threadedComments = buildThreadedComments(movie.comments)

    const totalComments = threadedComments.length

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedComments = threadedComments.slice(startIndex, endIndex)

    return res.status(200).json({
      totalComments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      comments: paginatedComments
    })

  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// ADD TOP-LEVEL COMMENT
// ===============================
exports.addComment = async (req, res) => {
  try {
    const comment = (req.body.comment || "").trim()

    if (!comment) {
      return res.status(400).json({ message: "Comment is required." })
    }

    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    movie.comments.push({
      userId: req.user.id,
      comment,
      parentCommentId: null
    })

    await movie.save()

    return res.status(200).json({ message: "Comment added" })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// REPLY TO COMMENT
// ===============================
exports.replyToComment = async (req, res) => {
  try {
    const comment = (req.body.comment || "").trim()
    const { movieId, commentId } = req.params

    if (!comment) {
      return res.status(400).json({ message: "Reply is required." })
    }

    const movie = await Movie.findById(movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const parent = movie.comments.id(commentId)
    if (!parent) return res.status(404).json({ message: "Parent comment not found" })

    movie.comments.push({
      userId: req.user.id,
      comment,
      parentCommentId: parent._id
    })

    await movie.save()

    return res.status(200).json({ message: "Reply added" })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// EDIT COMMENT (OWNER OR ADMIN)
// ===============================
exports.editComment = async (req, res) => {
  try {
    const comment = (req.body.comment || "").trim()
    const { movieId, commentId } = req.params

    if (!comment) {
      return res.status(400).json({ message: "Comment is required." })
    }

    const movie = await Movie.findById(movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const target = movie.comments.id(commentId)
    if (!target) return res.status(404).json({ message: "Comment not found" })

    const isOwner = String(target.userId) === String(req.user.id)
    const isAdmin = req.user.isAdmin === true

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    target.comment = comment
    target.isEdited = true
    target.editedAt = new Date()

    await movie.save()

    return res.status(200).json({ message: "Comment updated" })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// DELETE COMMENT (OWNER OR ADMIN) + CASCADE DELETE
// ===============================
exports.deleteComment = async (req, res) => {
  try {
    const { movieId, commentId } = req.params

    const movie = await Movie.findById(movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const target = movie.comments.id(commentId)
    if (!target) return res.status(404).json({ message: "Comment not found" })

    const isOwner = String(target.userId) === String(req.user.id)
    const isAdmin = req.user.isAdmin === true

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const idsToDelete = collectDescendants(movie.comments, commentId)
    movie.comments = movie.comments.filter((c) => !idsToDelete.includes(String(c._id)))

    await movie.save()

    return res.status(200).json({ message: "Comment deleted" })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// LIKE / DISLIKE COMMENT (PREVENT DUPES + TOGGLE)
// ===============================
exports.reactToComment = async (req, res) => {
  try {
    const { movieId, commentId } = req.params
    const { type } = req.body
    const userId = String(req.user.id)

    if (!["like", "dislike"].includes(type)) {
      return res.status(400).json({ message: "Invalid reaction type" })
    }

    const movie = await Movie.findById(movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const comment = movie.comments.id(commentId)
    if (!comment) return res.status(404).json({ message: "Comment not found" })

    const hasLiked = (comment.likes || []).some((id) => String(id) === userId)
    const hasDisliked = (comment.dislikes || []).some((id) => String(id) === userId)

    // ✅ TOGGLE LOGIC + MUTUAL EXCLUSIVITY
    if (type === "like") {
      if (hasLiked) {
        // toggle off like
        comment.likes = comment.likes.filter((id) => String(id) !== userId)
      } else {
        // add like + remove dislike if present
        comment.dislikes = comment.dislikes.filter((id) => String(id) !== userId)
        comment.likes.push(userId)
      }
    }

    if (type === "dislike") {
      if (hasDisliked) {
        // toggle off dislike
        comment.dislikes = comment.dislikes.filter((id) => String(id) !== userId)
      } else {
        // add dislike + remove like if present
        comment.likes = comment.likes.filter((id) => String(id) !== userId)
        comment.dislikes.push(userId)
      }
    }

    await movie.save()

    return res.status(200).json({
      message: "Reaction updated",
      likes: comment.likes.length,
      dislikes: comment.dislikes.length
    })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// GET ALL COMMENTS (ADMIN EXTRACTION + PAGINATION)
// ===============================
exports.getAllCommentsAdmin = async (req, res) => {
  try {

    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Access denied" })
    }

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))

    const movies = await Movie.find()
      .populate("comments.userId", "username")

    const allComments = []

    movies.forEach((movie) => {
      movie.comments.forEach((comment) => {
        allComments.push({
          movieId: movie._id,
          movieTitle: movie.title,
          commentId: comment._id,
          username: comment.userId?.username || "Unknown",
          comment: comment.comment,
          parentCommentId: comment.parentCommentId,
          likes: comment.likes?.length || 0,
          dislikes: comment.dislikes?.length || 0,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt
        })
      })
    })

    // Sort newest first
    allComments.sort((a, b) => b.createdAt - a.createdAt)

    const totalComments = allComments.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginated = allComments.slice(startIndex, endIndex)

    return res.status(200).json({
      totalComments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      comments: paginated
    })

  } catch (error) {
    console.log("ADMIN COMMENTS ERROR >>>", error)
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// TOGGLE WATCHLIST
// ===============================
exports.toggleWatchlist = async (req, res) => {
  try {
    const userId = req.user.id
    const movieId = req.params.movieId

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" })
    }

    const movie = await Movie.findById(movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const user = await User.findById(userId).select("watchlist")
    if (!user) return res.status(404).json({ message: "User not found" })

    const exists = (user.watchlist || []).some((id) => String(id) === String(movieId))

    if (exists) {
      await User.updateOne({ _id: userId }, { $pull: { watchlist: movieId } })
    } else {
      await User.updateOne({ _id: userId }, { $addToSet: { watchlist: movieId } })
    }

    const updated = await User.findById(userId).select("watchlist")
    const totalWatchlist = updated?.watchlist?.length || 0

    return res.status(200).json({
      message: exists ? "Removed from watchlist" : "Added to watchlist",
      totalWatchlist
    })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// GET WATCHLIST
// ===============================
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("watchlist")
    if (!user) return res.status(404).json({ message: "User not found" })

    return res.status(200).json({
      total: user.watchlist.length,
      watchlist: user.watchlist
    })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// ADMIN DASHBOARD DATA
// ===============================
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalMovies = await Movie.countDocuments()

    // ✅ SORT MOVIES BY TITLE (A → Z)
    const movies = await Movie.find().sort({ title: 1 })

    let totalComments = 0
    let totalRatings = 0
    let totalMovieLikes = 0

    // 🔥 For platform average rating
    let ratingSum = 0
    let ratingCount = 0

    movies.forEach((movie) => {
      totalComments += movie.comments.length
      totalRatings += movie.ratings.length
      totalMovieLikes += movie.likes.length

      movie.ratings.forEach((r) => {
        ratingSum += r.value
        ratingCount++
      })
    })

    const averagePlatformRating =
      ratingCount === 0 ? 0 : Number((ratingSum / ratingCount).toFixed(1))

    return res.status(200).json({
      totalUsers,
      totalMovies,
      totalComments,
      totalRatings,
      totalMovieLikes,
      averagePlatformRating
    })
  } catch (error) {
    console.log("ADMIN DASHBOARD ERROR >>>", error)
    return res.status(500).json({ message: "Server error" })
  }
}

// ===============================
// ADMIN - GET ALL MOVIES (PAGINATION)
// ===============================
exports.getAllMoviesAdmin = async (req, res) => {
  try {

    if (!req.user || req.user.isAdmin !== true) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
    const skip = (page - 1) * limit

    const totalMovies = await Movie.countDocuments()

    const movies = await Movie.find({})
      .collation({ locale: "en", strength: 2 })
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit)

    return res.status(200).json({
      totalMovies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
      movies
    })

  } catch (error) {
    console.log("ADMIN MOVIES ERROR >>>", error)
    return res.status(500).json({ message: "Server error" })
  }
}
