const {
  getAllCatService,
  getDefaultCatService,
  getUserCatService,
  getCatByIdService,
  createCatService,
  updateCatService,
} = require('./category.service');
const { validateName } = require('../../utils/validator');
const { createError } = require('../../utils/helpers');

const catController = {};

catController.createCategory = async (req, res, next) => {
  try {
    const {
      body: { name },
      user,
    } = req;

    validateName(name);

    const newCategory = await createCatService({ uid: user.id, name });

    if (newCategory.length) {
      return res.status(201).json({
        status: 'success',
        message: `${name} - category created succeffully!`,
        data: newCategory[0],
      });
    }
    throw createError({
      statusCode: 500,
      status: 'fail',
      message: 'Error in adding new category, Please try again!',
    });
  } catch (error) {
    next(error);
  }
};

catController.updateCategory = async (req, res, next) => {
  try {
    const {
      body: { name },
      params: { id },
      user,
    } = req;

    validateName(name);

    const updatedCategory = await updateCatService({ uid: user.id, name, id });

    if (updatedCategory.length) {
      return res.status(201).json({
        status: 'success',
        message: `${name} - category updated succeffully!`,
        data: updatedCategory[0],
      });
    }
    throw createError({
      statusCode: 500,
      status: 'fail',
      message: 'Error in updating the category, Please try again!',
    });
  } catch (error) {
    next(error);
  }
};

catController.getCategoryById = async (req, res, next) => {
  try {
    const categoryArray = await getCatByIdService(req.params.id, req.user.id);

    if (categoryArray.length) {
      return res.json({
        status: 'success',
        message: 'Category found',
        data: categoryArray[0],
      });
    } else {
      throw createError({
        status: 'fail',
        statusCode: 404,
        message: 'Category not found, please try again!',
      });
    }
  } catch (error) {
    next(error);
  }
};

catController.getDefaultCategories = async (req, res, next) => {
  try {
    const categoryArray = await getDefaultCatService();

    if (categoryArray.length) {
      return res.json({
        status: 'success',
        message: 'Categories found',
        data: categoryArray,
      });
    } else {
      throw createError({
        status: 'fail',
        statusCode: 404,
        message: 'Oops error in fetching categories, please try again!',
      });
    }
  } catch (error) {
    next(error);
  }
};

catController.getUserCategories = async (req, res, next) => {
  try {
    const categoryArray = await getUserCatService(req.user.id);

    if (categoryArray.length) {
      return res.json({
        status: 'success',
        message: 'Categories found',
        data: categoryArray,
      });
    } else {
      throw createError({
        status: 'fail',
        statusCode: 404,
        message: 'No custom category created by you!',
      });
    }
  } catch (error) {
    next(error);
  }
};

catController.getAllCategories = async (req, res, next) => {
  try {
    const categoryArray = await getAllCatService(req.user.id);

    if (categoryArray.length) {
      return res.json({
        status: 'success',
        message: 'Categories found',
        data: categoryArray,
      });
    } else {
      throw createError({
        status: 'fail',
        statusCode: 404,
        message: 'Oops error in fetching the categories, please try again!',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = catController;
