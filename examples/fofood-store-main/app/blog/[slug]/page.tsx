import Image from "next/image";
import { notFound } from "next/navigation";
import { FaTelegramPlane } from "react-icons/fa";
import {
	RiDiscordFill,
	RiLinkedinBoxFill,
	RiTwitterFill,
} from "react-icons/ri";
import Breadcrumbs from "@/components/breadcrumbs";
import Articles from "@/components/articles";
import { getBlogPost, getBlogPosts } from "@/lib/medusa";

export const revalidate = 60;

export default async function DetailBlog({
	params,
}: {
	params: { slug: string };
}) {
	const post = await getBlogPost(params.slug);

	if (!post) {
		notFound();
	}

	const allPosts = await getBlogPosts();
	const related = allPosts.filter((p) => p.handle !== post.handle).slice(0, 3);

	return (
		<div className="container">
			<div className="pb-10 pt-28 lg:pb-20 lg:pt-36">
				<Breadcrumbs previousPath="Blog" currentPath={post.title} />
				<div className="mx-auto pt-16 lg:w-4/5">
					<h2 className="text-heading-4 lg:text-heading-2 text-center text-secondary-100">
						{post.title}
					</h2>
					<div className="mt-4 flex items-center justify-center space-x-3">
						{post.author_avatar && (
							<Image
								className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-white"
								src={post.author_avatar}
								alt={post.author_name || "author"}
								width={48}
								height={48}
							/>
						)}
						<div className="space-y-1.5 text-start">
							<span className="text-body-3-bold block text-secondary-100">
								By {post.author_name || "FoFood"}
							</span>
							<span className="text-body-3-bold block text-secondary-50">
								{post.published_at}
							</span>
						</div>
					</div>
					<div className="mx-auto lg:w-[75%]">
						{post.image && (
							<div
								className="mt-4 h-[240px] rounded-2xl bg-cover bg-center lg:h-[430px]"
								style={{ backgroundImage: `url(${post.image})` }}
							/>
						)}
						<div
							className="mt-8"
							dangerouslySetInnerHTML={{ __html: post.content || "" }}
						/>
					</div>
					<div className="mt-8 flex flex-col items-center space-y-3">
						<span className="text-heading-6 text-secondary-100">Share</span>
						<div className="flex space-x-5">
							{[RiDiscordFill, RiTwitterFill, FaTelegramPlane, RiLinkedinBoxFill].map(
								(Icon, i) => (
									<button
										key={i}
										className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 transition duration-200 hover:bg-additional-yellow"
									>
										<Icon className="h-5 w-5 text-white transition duration-200 group-hover:text-secondary-100" />
									</button>
								)
							)}
						</div>
					</div>
				</div>
				{related.length > 0 && (
					<div className="pb-10 pt-20 lg:pt-40">
						<h3 className="text-caption-2 lg:text-caption-1 text-center text-primary-100">
							Our Blog
						</h3>
						<h2 className="text-heading-4 lg:text-heading-2 mt-2 text-center">
							Related Articles
						</h2>
						<Articles data={related} />
					</div>
				)}
			</div>
		</div>
	);
}
