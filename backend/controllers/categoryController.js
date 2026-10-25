import Category from "../models/Category.js";

const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            catogery,
        })
    } catch (error) {
        next(error);
    }
}

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        })
    } catch (error) {
        next(error);
    }
}

const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }
        res.status(200).json({
            success: true,
            category,
        })

    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        })
    } catch (error) {
        next(error)
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) {
            return res.status(404).json({
                succsss: false,
                message: "Category not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

export {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}