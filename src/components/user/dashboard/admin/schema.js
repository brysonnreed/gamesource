import * as yup from "yup";

const ArticleSchema = {
	game: yup.string().required("The game is required!"),
	title: yup
		.string()
		.required("The title is required!")
		.min(20, "Make the title longer")
		.max(70, "Make the title shorter"),
	excerpt: yup
		.string()
		.required("The excerpt is required!")
		.min(100, "Make the excerpt longer")
		.max(400, "Make the excerpt shorter"),
	editor: yup.string().required("The body is required!").min(100, "Make the body longer"),
	rating: yup
		.string()
		.required("Rating is required")
		.notOneOf(["Select a Rating"], "You need to select a rating"),
	img: yup.string().required("Image is required").url("Is this a valid URL?"),
};

export default ArticleSchema;
