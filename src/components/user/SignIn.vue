<template>
	<div class="signin_container">
		<!-- loader -->
		<div class="text-center" v-show="userStore.loading">
			<v-progress-circular indeterminate color="primary" />
		</div>

		<Form @submit="onSubmit" :validation-schema="formSchema" v-show="!userStore.loading">
			<h1 v-text="!type ? 'Sign In' : 'Register'"></h1>

			<!-- NOTE: Email -->
			<div class="form-group">
				<Field name="email" v-slot="{ field, errors, errorMessage }">
					<input
						type="text"
						class="form-control"
						placeholder="Enter your email"
						v-bind="field"
						:class="{ 'is-invalid': errors.length != 0 }"
					/>
					<div class="input_alert" v-if="errors.length != 0">
						{{ errorMessage }}
					</div>
				</Field>
			</div>

			<!-- NOTE: Password -->
			<div class="form-group">
				<Field name="password" v-slot="{ field, errors, errorMessage }">
					<input
						type="password"
						class="form-control"
						placeholder="Enter your password"
						v-bind="field"
						:class="{ 'is-invalid': errors.length != 0 }"
					/>
					<div class="input_alert" v-if="errors.length != 0">
						{{ errorMessage }}
					</div>
				</Field>
			</div>

			<!-- NOTE: Submit Form -->
			<button
				type="submit"
				class="btn btn-block mb-3"
				v-text="!type ? 'Sign in' : 'Register'"
			></button>
			<hr />
			<div class="form_swap" @click="type = !type">
				<span v-if="type">I want to <b>Sign in</b></span>
				<span v-else="!type">I want to <b>Register</b></span>
			</div>
		</Form>
	</div>
</template>

<script setup>
	import { Field, Form } from "vee-validate";
	import * as yup from "yup";
	import { ref } from "vue";

	// Toasts
	import { useToast } from "vue-toast-notification";
	const $toast = useToast();

	// Auth Store
	import { useUserStore } from "@/stores/user";
	const userStore = useUserStore();

	const type = ref(false);
	const formSchema = yup.object({
		email: yup.string().required("The email is required").email("Not a valid email"),
		password: yup.string().required("The password is required"),
	});

	function onSubmit(values, { resetForm }) {
		if (type.value) {
			// register
			userStore.register(values);
		} else {
			// sign in
			userStore.signIn(values);
		}
	}

	// Subscribe to error
	userStore.$onAction(({ name, after, onError }) => {
		if (name === "register" || name === "signIn") {
			after(() => {
				$toast.success("Welcome", {
					position: "bottom",
				});
			});
			onError((error) => {
				$toast.error(error.message, {
					position: "bottom",
				});
			});
		}
	});
</script>
