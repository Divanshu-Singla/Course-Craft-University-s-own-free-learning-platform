const axios = require("axios");

// @desc    Get news by category
// @route   GET /api/news/:category
// @access  Public
const getNews = async (req, res) => {
    try {
        const { category = "technology" } = req.params;
        
        const API_KEY = process.env.NEWS_API_KEY || "beb432998ae54ffdac2f39bf62b70c27";
        
        const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${API_KEY}`
        );
        
        res.json({
            success: true,
            articles: response.data.articles || []
        });
    } catch (error) {
        console.error("Error fetching news:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch news",
            error: error.response?.data?.message || error.message
        });
    }
};

module.exports = { getNews };
