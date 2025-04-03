import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function SignIn(): JSX.Element {
    // Data for form fields
    const formFields = [
        { id: "email", placeholder: "Email", type: "email" },
        { id: "password", placeholder: "Password", type: "password" },
    ];

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#fff8f6]">
            <div className="w-full max-w-[375px] h-[812px] relative flex flex-col items-center px-6">
                {/* Title */}
                <h1 className="text-4xl text-[#ff785b] font-normal mt-[129px] mb-12 font-['Inter-Regular',Helvetica]">
                    VGU Delivery
                </h1>

                {/* Form */}
                <form className="w-full flex flex-col gap-8">
                    {/* Email Input */}
                    <div className="relative">
                        <Input
                            id={formFields[0].id}
                            type={formFields[0].type}
                            placeholder={formFields[0].placeholder}
                            className="h-[50px] rounded-[33px] border border-[#ff785b] px-7 py-3 text-[15px] font-['Avenir-Roman',Helvetica] text-[#858c82e6] placeholder:text-[#858c82e6]"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <Input
                            id={formFields[1].id}
                            type={formFields[1].type}
                            placeholder={formFields[1].placeholder}
                            className="h-[50px] rounded-[33px] border px-7 py-3 text-[15px] font-['Avenir-Roman',Helvetica] text-[#858c82e6] placeholder:text-[#858c82e6]"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-[219px] h-[39px] bg-[#ff785b] hover:bg-[#ff785b]/90 rounded-[33px] text-white text-sm font-['Avenir-Heavy',Helvetica] mt-12 mx-auto"
                    >
                        Eat Away!
                    </Button>
                </form>

                {/* Sign Up Button */}
                <div className="absolute bottom-0 left-0 right-0 w-full">
                    <Button
                        variant="default"
                        className="w-full h-[68px] bg-[#ff785b] hover:bg-[#ff785b]/90 rounded-[33px_33px_0px_0px] text-white text-xl font-['Avenir-Roman',Helvetica] shadow-[0px_4px_4px_#ff785b]"
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </div>
    );
}
