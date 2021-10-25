const express = require('express');
const router = express.Router();
const Product = require('../models/Product')
const Category = require('../models/Category')

/* GET home page. */
router.get('/', async function (req, res, next) {
  const categories = await Category.find()
  // console.log(products); // massiv

  res.render('index', {
    layout: 'layout',
    categories
  });
});

router.post('/new', async function (req, res, next) {
  // console.log(req.body);

  const { name, price } = req.body
  const product = new Product({
    name,
    price
  })

  await product.save()
  res.redirect('/')
});



module.exports = router;