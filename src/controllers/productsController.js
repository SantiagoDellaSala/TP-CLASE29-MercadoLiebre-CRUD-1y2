const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    return res.render("products.ejs", {
      products,
      toThousand,
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    const product = products.find((product) => product.id === +req.params.id);
    return res.render("detail.ejs", {
      ...product,
      toThousand,
    });
  },

  // Create - Form to create
  create: (req, res) => {
    return res.render("product-create-form.ejs");
  },

  // Create -  Method to store
  store: (req, res) => {
    const lastID = products[products.length - 1].id;

    const { name, price, discount, category, description } = req.body;

    const image = req.file.filename;

    const newProduct = {
      id: lastID + 1,
      name: name.trim(),
      price: +price,
      discount: +discount,
      category: category,
      description: description.trim(),
      image: image,
    };

    products.push(newProduct);

    fs.writeFileSync(productsFilePath, JSON.stringify(products), 'utf-8');

    return res.redirect('/products/detail/' + newProduct.id);
},

  // Update - Form to edit
  edit: (req, res) => {
	const product = products.find((product) => product.id === +req.params.id);
    return res.render('product-edit-form.ejs', {
		...product
	});
  },
  // Update - Method to update
  update: (req, res) => {
    const {name, price, discount, category, description} = req.body

	const productsUpdated = products.map(product => {
		if (product.id === +req.params.id) {
			product.name = name.trim(),
			product.price = +price,
			product.discount = +discount,
			product.category = category,
			product.description = description.trim()
		}

		return product;

	})

	fs.writeFileSync(productsFilePath, JSON.stringify(productsUpdated), 'utf-8');

    return res.redirect('/products/detail/' + req.params.id);
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    const updatedProducts = products.filter(product => product.id !== +req.params.id);

    fs.writeFileSync(productsFilePath, JSON.stringify(updatedProducts), 'utf-8');
    
    return res.redirect('/products');
},
};

module.exports = controller;