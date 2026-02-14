import Link from "next/link";
import Header from "@/components/home/header";
import { blogs } from "@/data/blogs";
import Footer from "@/components/common/footer";

export default function BlogListing() {
    return (
        <>
            <Header />
            <div className="container mx-auto px-6 py-12 mt-10">
                <h1 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
                    Our Latest Blogs
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {blogs?.map((blog) => (
                        <Link key={blog.id} href={`/blog/blogDetails/${blog.id}`}>
                            <div className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-xl dark:hover:shadow-lg transition h-[400px] flex flex-col border border-gray-200 dark:border-gray-700">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {blog.summary}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
