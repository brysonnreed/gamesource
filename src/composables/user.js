import { ref } from "vue";
// Yup
import * as yup from "yup";
// Auth store
import { useUserStore } from "@/stores/user";

export const updateProfile = () => {
	const userStore = useUserStore();
	const firstname = ref(userStore.user.firstname);
	const lastname = ref(userStore.user.lastname);

	const loading = ref(false);
	const formSchema = yup.object({
		firstname: yup.string().required("First Name is required").max(100, "Name is to long"),
		lastname: yup.string().required("Last Name is required").max(100, "Name is to long"),
	});

	function onSubmit(values, { resetForm }) {
		loading.value = true;
		userStore.updateProfile(values).finally(() => {
			loading.value = false;
		});
	}

	return { firstname, lastname, loading, onSubmit, formSchema };
};
