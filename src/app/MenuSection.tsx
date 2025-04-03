import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCartIcon } from "lucide-react";
import React from "react";

export default function MenuSection() {
    // Menu items data for mapping
    const menuItems = [
        {
            id: 1,
            name: "Stewed cabbage with sauce",
            price: "$5.90",
            image: "",
            featured: false,
        },
        {
            id: 2,
            name: "Puree soup with turkey pieces",
            price: "$7.55",
            image: "",
            featured: true,
        },
        {
            id: 3,
            name: "Chicken with vegetables",
            price: "$3.39",
            image: "",
            featured: false,
        },
        {
            id: 4,
            name: "Chicken with vegetables",
            price: "$3.39",
            image: "",
            featured: false,
        },
        {
            id: 5,
            name: "Traditional Greek salad",
            price: "$4.99",
            image: "",
            featured: false,
        },
        {
            id: 6,
            name: "Three-Meat Special Lasagna",
            price: "$5.10",
            image: "",
            featured: false,
        },
        {
            id: 7,
            name: "Veggie Tagliatelle Bolognese",
            price: "$4.80",
            image: "",
            featured: false,
        },
        {
            id: 8,
            name: "Veggie Tagliatelle Bolognese",
            price: "$4.80",
            image: "",
            featured: false,
        },
    ];

    return (
        <section className="w-full py-[109px] px-[170px] bg-[#29b0674c] rounded-[0px_0px_0px_250px]">
            <div className="flex flex-col items-center gap-[65px]">
                <h2 className="font-bold text-[50px] text-[#2e2c49] text-center tracking-[0.25px] leading-[58px] [font-family:'Red_Rose-Bold',Helvetica]">
                    Popular dishes with delivery
                </h2>

                <p className="w-[663px] font-normal text-lg text-[#777e90] text-center tracking-[0.09px] leading-7 [font-family:'Red_Hat_Text-Regular',Helvetica]">
                    The most delicious and healthy dishes from our chefs. You can order
                    this meal separately or as part of a meal plan.
                </p>

                <div className="flex flex-col items-center gap-[104px] w-full">
                    <div className="flex flex-wrap items-start gap-[79px_60px] w-full">
                        {menuItems.map((item) => (
                            <div key={item.id} className="w-[350px]">
                                <Card
                                    className={`w-[350px] h-[458px] rounded-[28px] border-2 ${
                                        item.featured
                                            ? "bg-[#fa9f3d] shadow-[0px_28px_63px_-13px_#fa9f3d4c]"
                                            : "bg-white border-[#e5efff]"
                                    }`}
                                >
                                    <CardContent className="p-0 relative h-full">
                                        <div className="w-[296px] h-[296px] mx-auto mt-[1px]">
                                            <img
                                                className="w-full h-full object-cover"
                                                alt={item.name}
                                                src={item.image}
                                            />
                                        </div>

                                        <div
                                            className={`w-[267px] mx-auto text-center mt-4 font-bold text-2xl leading-[34px] tracking-[0] ${
                                                item.featured ? "text-white" : "text-[#4d4c66]"
                                            } [font-family:'Red_Rose-Bold',Helvetica]`}
                                        >
                                            {item.name}
                                        </div>

                                        <div className="absolute bottom-[30px] left-8 font-normal text-3xl leading-6 tracking-[0] whitespace-nowrap [font-family:'Red_Rose-Regular',Helvetica] text-[#2e2c49]">
                                            {item.price}
                                        </div>

                                        <Button
                                            className={`absolute bottom-[24px] right-[36px] w-[38px] h-[38px] p-0 ${
                                                item.featured && !item.id === 2
                                                    ? "bg-[#fffefc]"
                                                    : "bg-[#fa9f3d]"
                                            } rounded-lg`}
                                            size="icon"
                                        >
                                            <ShoppingCartIcon className="w-5 h-5" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <Button className="w-[205px] h-[60px] bg-[#fdad00] hover:bg-[#fdad00]/90 rounded-[10px] shadow-[0px_8px_12px_#ffeaa273] font-bold text-[22px] leading-[26px] tracking-[0] [font-family:'Red_Rose-Bold',Helvetica]">
                        See all menu
                    </Button>
                </div>
            </div>
        </section>
    );
}
