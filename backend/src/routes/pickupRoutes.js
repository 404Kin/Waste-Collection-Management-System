
const express = require('express');
const router = express.Router();
const { 
  createPickup, 
  getPickups, 
  getPickupById, 
  updatePickupStatus,
  deletePickup ,
  getAllPickups
} = require('../controllers/pickupController');

router.post('/', createPickup);
router.get('/', getPickups);
router.get('/all', getAllPickups); 
router.get('/:id', getPickupById);
router.put('/:id', updatePickupStatus);
router.delete('/:id', deletePickup);

module.exports = router;