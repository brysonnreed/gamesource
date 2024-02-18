<template>
	<div class="container"><AppCarousel /><Featured /></div>
</template>

<script setup>
	// Carousel
	import AppCarousel from "@/utils/carousel.vue";
	import Featured from "./featured.vue";

	// Article Store
	import { useArticleStore } from "@/stores/articles";
	const articleStore = useArticleStore();

	// Router
	import { useRouter } from "vue-router";
	const router = useRouter();

	if (!articleStore.homeArticles) {
		articleStore.getArticles(8);
	}
</script>
