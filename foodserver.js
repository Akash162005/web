const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/restaurantDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB error:', err));


const orderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  items: Array,
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

app.post('/order', async (req, res) => {
  try {
    const { customerName, phone, items, totalAmount } = req.body;
    const newOrder = new Order({ customerName, phone, items, totalAmount });
    await newOrder.save();
    res.json({ message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', err });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));
