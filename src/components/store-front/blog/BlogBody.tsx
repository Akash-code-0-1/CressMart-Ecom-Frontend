import Image from "next/image";

export default function BlogBody() {
  return (
    <section className="container mx-auto px-4 py-10 font-inter">
      {/* Intro Text */}
      <div className="mb-10">
        <h4 className="text-black font-bold text-lg mb-4">
          The standard Lorem Ipsum passage, used since the 1500s
        </h4>
        <p className="text-[#585858] leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>

      {/* Side by Side Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="relative h-[250px] md:h-[400px] rounded-xl overflow-hidden">
          <Image
            src="/images/store-front/brand/blog.png"
            alt="Detail 1"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-[250px] md:h-[400px] rounded-xl overflow-hidden">
          <Image
            src="/images/store-front/brand/blog.png"
            alt="Detail 2"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Main Body Text */}
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div key={i}>
            <h4 className="text-black font-bold text-lg mb-4 uppercase tracking-wide">
              Section 1.10.32 of de Finibus Bonorum et Malorum, written by
              Cicero in 45 BC
            </h4>
            <p className="text-[#585858] leading-relaxed mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit.
            </p>
            <p className="text-[#585858] leading-relaxed">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
