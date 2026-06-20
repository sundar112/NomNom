import Link from "next/link";
import { MdDoubleArrow } from "react-icons/md";
import { BlogPost } from "@/lib/medusa";

const Articles = ({ data }: { data: BlogPost[] }) => {
	return (
		<div className="mt-10 grid grid-cols-1 gap-y-10 lg:mt-16 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16">
			{data.map((article) => (
				<div key={article.id}>
					<div
						className="h-[250px] rounded-2xl bg-cover bg-center"
						style={{
							backgroundImage: `url(${article.image})`,
						}}
					/>
					<h6 className="text-heading-6 mt-6 text-secondary-100">
						{article.title}
					</h6>
					{article.excerpt && (
						<p className="text-body-3-regular mt-2 text-secondary-50">
							{article.excerpt}
						</p>
					)}
					<Link
						href={`/blog/${article.handle}`}
						className="text-caption-3 mt-6 flex items-center space-x-2 text-primary-100 hover:underline"
					>
						<span>Read More</span>
						<MdDoubleArrow />
					</Link>
				</div>
			))}
		</div>
	);
};

export default Articles;
