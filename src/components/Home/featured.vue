<template>
	<div>
		<v-row v-masonry transition-duration="0.3s">
			<v-col
				v-masonry-tile
				v-for="(article, i) in articleStore.getHomeArticles"
				:key="article.id"
				:sm="4"
			>
				<!-- Cards -->
				<v-card>
					<v-img height="200" :src="article.img" cover class="text-white" />
					<v-card-item>
						<v-card-title> {{ article.title }}</v-card-title>
						<v-card-subtitle>{{ article.game }}</v-card-subtitle>
					</v-card-item>
					<v-card-text>{{ article.excerpt }}</v-card-text>

					<v-card-actions>
						<router-link :to="{ name: 'article', params: { id: article.id } }">
							<v-btn>Read Article</v-btn>
						</router-link>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>

<script setup>
	// Article Store
	import { useArticleStore } from "@/stores/articles";
	const articleStore = useArticleStore();

	articleStore.getHomeArticles;
</script>
