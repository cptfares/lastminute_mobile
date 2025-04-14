const Purchase = require('../model/purchaces');  // Correct the file name if necessary (e.g., 'purchaces' to 'purchases')

exports.createPurchase = async (req, res) => {
  const transaction = req.body;
  console.log('Received data:', req.body); 

  try {
    // Create a new purchase using the Purchase model
    const purchase = new Purchase(transaction);

    // Save the purchase in the database
    await purchase.save();

    // Send a success response
    res.status(201).json({
      message: 'Purchase created successfully',
      purchase,
    });
  } catch (error) {
    console.error(error);  // Log the error for debugging purposes
    res.status(500).json({
      message: 'Error creating purchase',
      error: error.message || 'Internal Server Error',
    });
  }
};

exports.getAllPurchases = async (req, res) => {
    try {
      const purchases = await Purchase.find()
      
  
      res.status(200).json(purchases);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching purchases', error });
    }
  };
exports.getPurchasesByUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const purchases = await Purchase.find({ userId })
  
      res.status(200).json(purchases);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user purchases', error });
    }
  };
  exports.deletePurchase = async (req, res) => {
    const { purchaseId } = req.params;
  
    try {
      const result = await Purchase.findByIdAndDelete(purchaseId);
  
      if (!result) {
        return res.status(404).json({ message: 'Purchase not found' });
      }
  
      res.status(200).json({ message: 'Purchase deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting purchase', error });
    }
  };
  
  exports.getPurchaseByUserAndProduct = async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      // Find the purchase by userId and productId
      const purchase = await Purchase.findOne({ userId, productId });
  
      if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
      }
  
      // Return the purchaseId
      res.status(200).json({ purchaseId: purchase._id });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching purchase', error });
    }
  };