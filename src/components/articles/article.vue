<template>
	<div class="container p_top">
		<!-- loader -->
		<div class="text-center" v-if="loading">
			<v-progress-circular indeterminate color="primary" />
		</div>

		<div class="article_page" v-else>
			<div class="game_tag">{{ article.game }}</div>
			<div class="article_featured" :style="{ background: `url(${article.img})` }"></div>
			<div class="article_content">
				<div class="owner">
					Article Written by: <b>{{ article.owner.firstname }} {{ article.owner.lastname }}</b>
				</div>
				<hr />
				<h1>{{ article.title }}</h1>
				<div class="editor" v-html="article.editor"></div>
				<hr />
				<div class="article_rating">
					Our rating is: <b>{{ article.rating }}</b>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue";

	// Article Store
	import { useArticleStore } from "@/stores/articles";
	const articleStore = useArticleStore();

	// Router
	import { useRoute } from "vue-router";
	const route = useRoute();

	const loading = ref(true);
	const article = ref("");

	articleStore
		.getArticleById(route.params.id)
		.then((res) => {
			article.value = res;
		})
		.finally(() => {
			loading.value = false;
		});
</script>
