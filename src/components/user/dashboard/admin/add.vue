<template>
	<h1>Add Article</h1>
	<hr />

	<div class="text-center m-3" v-show="loading">
		<v-progress-circular color="primary" indeterminate />
	</div>

	<Form class="mb-5" @submit="onSubmit" :validation-schema="ArticleSchema" v-show="!loading">
		<!-- NOTE: Name of the game -->
		<div class="mb-4">
			<Field name="game" v-slot="{ field, errors, errorMessage }">
				<input
					type="text"
					placeholder="Name of the game"
					v-bind="field"
					class="form-control"
					:class="{ 'is-invalid': errors.length != 0 }"
				/>
				<div class="input_alert" v-if="errors.length != 0">
					{{ errorMessage }}
				</div>
			</Field>
		</div>

		<!-- NOTE: title of the Article -->
		<div class="mb-4">
			<Field name="title" v-slot="{ field, errors, errorMessage }">
				<input
					type="text"
					placeholder="Title of the game"
					v-bind="field"
					class="form-control"
					:class="{ 'is-invalid': errors.length != 0 }"
				/>
				<div class="input_alert" v-if="errors.length != 0">
					{{ errorMessage }}
				</div>
			</Field>
		</div>

		<!-- NOTE: Excerpt -->
		<div class="mb-4">
			<Field name="excerpt" v-slot="{ field, errors, errorMessage }">
				<textarea
					rows="3"
					placeholder="Add an excerpt"
					v-bind="field"
					class="form-control"
					:class="{ 'is-invalid': errors.length != 0 }"
				></textarea>
				<div class="input_alert" v-if="errors.length != 0">
					{{ errorMessage }}
				</div>
			</Field>
		</div>

		<!-- NOTE: WYSIWYG -->
		<div class="mb-4">
			<WYSIWYG @update="updateEditor" />
			<Field name="editor" v-model="veditor" v-slot="{ field, errors, errorMessage }">
				<input type="hidden" id="v-editor" v-bind="field" />
				<div class="input_alert" v-if="errors.length != 0">
					{{ errorMessage }}
				</div>
			</Field>
		</div>

		<!-- NOTE: Rating -->
		<div class="mb-4">
			<Field name="rating" value="Select a Rating" v-slot="{ field, errors, errorMessage }">
				<select class="form-select" v-bind="field" :class="{ 'is-invalid': errors.length != 0 }">
					<option value="Select a Rating">Select a Rating</option>
					<option v-for="rating in ratingArray" :key="rating" :value="rating">{{ rating }}</option>
				</select>
				<div class="input_alert" v-if="errors.length != 0">
					{{ errorMessage }}
				</div>
			</Field>
		</div>

		<!-- NOTE: Img -->
		<div class="mb-4">
			<Field name="img" v-slot="{ field, errors, errorMessage }">
				<input
					type="text"
					placeholder="Add the source of the img"
					v-bind="field"
					class="form-control"
					:class="{ 'is-invalid': errors.length != 0 }"
				/>
				<div class="input_alert" v-if="errors.length != 0">
					{{ errorMessage }}
				</div>
			</Field>
		</div>
		<v-btn type="submit" variant="outlined">Add Article</v-btn>
	</Form>
</template>

<script setup>
	import { ref } from "vue";
	import { Field, Form } from "vee-validate";
	import ArticleSchema from "./schema";

	// WSIWYG
	import WYSIWYG from "@/utils/wysiwyg.vue";

	// Article Store
	import { useArticleStore } from "@/stores/articles";
	const articleStore = useArticleStore();

	// Toasts
	import { useToast } from "vue-toast-notification";
	const $toast = useToast();

	const loading = ref(false);
	const ratingArray = [0, 1, 2, 3, 4, 5];
	const veditor = ref("");

	const onSubmit = (values, { resetForm }) => {
		loading.value = true;
		articleStore
			.addArticle(values)
			.then(() => {
				$toast.success("New Article Created", {
					position: "bottom",
				});
			})
			.catch((error) => {
				$toast.error(error.message, {
					position: "bottom",
				});
			})
			.finally(() => {
				loading.value = false;
			});
	};

	function updateEditor(value) {
		veditor.value = value;
	}
</script>
