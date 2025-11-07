// backend/controllers/requestController.js
const requestService = require('../services/requestService');

// Get all requests (optionally filter by status)
exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const requests = await requestService.getAllRequests(status);
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Get a single request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await requestService.getRequestById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json(request);
  } catch (err) {
    console.error('Error fetching request:', err);
    res.status(500).json({ message: 'Failed to fetch request' });
  }
};

// Create a new request
exports.createRequest = async (req, res) => {
  try {
    const { item_id, requester_id, quantity_needed } = req.body;
    if (!item_id || !requester_id)
      return res.status(400).json({ message: 'Item ID and requester ID are required' });

    const requestId = await requestService.createRequest(item_id, requester_id, quantity_needed);
    res.status(201).json({ message: 'Request created successfully', requestId });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: 'Failed to create request' });
  }
};

// Update request status (admin only)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedRequest = await requestService.updateRequestStatus(id, status);
    res.status(200).json({ message: 'Request status updated', updatedRequest });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ message: err.message });
  }
};
