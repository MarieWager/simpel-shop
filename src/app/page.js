import Image from "next/image";
import Link from "next/link";
import shoppingImg from "../../public/shopping-women.png";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center min-h-screen">

    <section className="flex flex-col gap-8 md:gap-16 justify-center p-15">
      <h1 className="font-heading text-[10vw] md:text-8xl">Simple<br></br>Shop</h1>
      <Link href="/products">
      <Button className="w-fit">Explore</Button>
      </Link>
    </section>

      <Image src={shoppingImg} alt="image of woman with shopping bags" className="w-full h-auto md:h-full object-cover"></Image>

    </div>
  );
}
