const Charity = require('../models/charityModel');

// @GET /api/charities
const getCharities = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const charities = await Charity.find(filter).sort({ isFeatured: -1, createdAt: -1 });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/charities/:id
const getCharityById = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/charities (admin)
const createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/charities/:id (admin)
const updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/charities/:id (admin)
const deleteCharity = async (req, res) => {
  try {
    await Charity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Charity deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCharities, getCharityById, createCharity, updateCharity, deleteCharity };