import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().min(2, "Please provide email or Telegram handle"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Here you would typically send the data to your backend
    console.log("Form submitted:", values);
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you soon.",
    });
    
    setOpen(false);
    form.reset();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-violet hover:opacity-90 transition-all duration-200 rounded-md"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Contact Us</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="glass-card">
        <DrawerHeader>
          <DrawerTitle>Contact Us</DrawerTitle>
          <DrawerDescription>
            Send us your question or feedback. We'll get back to you soon.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Telegram</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com or @telegram_handle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your question or feedback..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}