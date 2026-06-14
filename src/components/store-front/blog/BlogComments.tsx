export default function BlogComments() {
  return (
    <section className="container mx-auto px-4 md:mt-20 mt-10 bg-[#FAFAFA] md:bg-transparent rounded-3xl">
      <h3 className="text-black font-poppins text-2xl font-bold mb-2">
        Comment
      </h3>
      <p className="text-[#8C8C8C] text-sm mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 ml-1">
            Nickname
          </label>
          <input
            type="text"
            placeholder="Type your nickname here"
            className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-[#FF7050] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 ml-1">Email</label>
          <input
            type="email"
            placeholder="Type your email here"
            className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-[#FF7050] transition-colors"
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 ml-1">
            Comment
          </label>
          <textarea
            rows={5}
            placeholder="Type your email here"
            className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-[#FF7050] transition-colors resize-none"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button className="bg-[#FF7050] text-white px-10 py-4 rounded-xl font-bold uppercase shadow-lg shadow-orange-200 hover:opacity-90 transition-all">
            Submit Comment
          </button>
        </div>
      </form>
    </section>
  );
}
