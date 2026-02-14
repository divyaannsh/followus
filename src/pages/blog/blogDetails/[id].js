import { useRouter } from "next/router";
import Header from "@/components/home/header";
import { blogs } from "@/data/blogs";

export default function BlogDetail() {
  const router = useRouter();
  const { id } = router.query;

  console.log("Blog ID:", id);
  

  const blog = blogs.find((b) => b.id === id);

  if (!blog) return <div className="p-10 text-center">Blog Not Found</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl mt-20">
        <img src={blog.image} alt={blog.title} className="w-full h-80 object-cover rounded-lg mb-6" />
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </>
  );
}
