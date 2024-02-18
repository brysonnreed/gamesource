<template>
	<div>
		<h1>User Profile</h1>
		<hr />
		<Form @submit="onSubmit" :validation-schema="formSchema" class="mb-5 col-md-5">
			<!-- NOTE: first name -->
			<div class="mb-4">
				<Field name="firstname" v-model="firstname" v-slot="{ field, errors, errorMessage }">
					<input
						type="text"
						class="form-control"
						placeholder="Enter your first name"
						v-bind="field"
						:class="{ 'is-invalid': errors.length != 0 }"
					/>
					<div class="input_alert" v-if="errors.length != 0">
						{{ errorMessage }}
					</div>
				</Field>
			</div>
			<!-- NOTE: last name -->
			<div class="mb-4">
				<Field name="lastname" v-model="lastname" v-slot="{ field, errors, errorMessage }">
					<input
						type="text"
						class="form-control"
						placeholder="Enter your last name"
						v-bind="field"
						:class="{ 'is-invalid': errors.length != 0 }"
					/>
					<div class="input_alert" v-if="errors.length != 0">
						{{ errorMessage }}
					</div>
				</Field>
			</div>

			<v-btn type="submit" :loading="loading" :disabled="loading" variant="outlined"
				>Update Profile</v-btn
			>
		</Form>
	</div>
</template>

<script setup>
	// USER store
	import { updateProfile } from "@/composables/user";

	// Vee Validate
	import { Field, Form } from "vee-validate";

	const { firstname, lastname, loading, onSubmit, formSchema } = updateProfile();
</script>
