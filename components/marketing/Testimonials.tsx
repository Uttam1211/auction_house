import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Art Collector",
      avatar: "/avatars/avatar-1.jpg",
      content:
        "Found rare pieces that I couldn't find anywhere else. The authentication process gives me peace of mind.",
    },
    {
      name: "Sarah Chen",
      role: "Gallery Owner",
      avatar: "/avatars/avatar-2.jpg",
      content:
        "The platform has transformed how we connect with collectors. Exceptional service and support.",
    },
    // Add more testimonials...
  ];

  return (
    <section className="py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 dark:text-white">
        What Our Collectors Say
      </h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6"
      >
        <CarouselContent className="-ml-2 sm:-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={index}
              className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <Card className="mx-1 sm:mx-2 h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg dark:text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {testimonial.content}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static sm:absolute" />
          <CarouselNext className="static sm:absolute" />
        </div>
      </Carousel>
    </section>
  );
}
