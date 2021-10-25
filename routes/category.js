const { Router } = require('express')
const router = Router()
const fileUpload = require('../middleware/fileUpload')
const Category = require('../models/Category')
const product = require('../models/Product')

router.get('/read', async (req, res) => {
    const categories = await Category.find()

    res.render('admin/categories', {
        title: 'Kategoriyalarni ko`rish',
        header: 'Kategoriyalarni ko`rish',
        categories,
        layout: 'main',
    })
})

router.get('/add', (req, res) => {
    res.render('admin/categoryCreate', {
        title: 'Kategoriya yaratish',
        header: 'Kategoriya yaratish',
        layout: 'main',
    })
})

router.post('/add', fileUpload.single('categoryIcon'), async (req, res) => {
    const { categoryName, sortNumber } = req.body
    const categoryIcon = req.file.filename
    const category = new Category({
        categoryName,
        sortNumber,
        categoryIcon
    })
    await category.save()
    res.redirect('/admin/category/read')
})

router.get("/edit/:id", async (req, res) => {
    const categories = await Category.findById(req.params.id);
    console.log(categories);
    res.render("admin/edit", {
        categories,
        layout: "main",
    });
});

router.post("/edit/:id", async (req, res) => {
    console.log(req.body);
    const { categoryName, sortNumber } = req.body
    // const asd = req.body


    await Category.findByIdAndUpdate(req.params.id, {
        categoryName,
        sortNumber
    }, (err) => {
        if (err) {
            console.log(err);
        } else {

            res.redirect('/admin/category/read')
        }
    })

})

router.get('/delete/:id', async (req, res) => {
    await Category.findByIdAndDelete(req.params.id)
    res.redirect('/admin/category/read', {
        layout: 'main'
    })
})

module.exports = router