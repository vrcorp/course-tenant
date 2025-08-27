import Faqs from "@/components/landing/Faqs";

export default function FAQ() {
  return (
    <div className="py-12">
      <div className="text-center mb-4 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Pertanyaan Umum</h1>
        <p className="text-muted-foreground mt-2">Jawaban cepat untuk hal-hal yang sering ditanyakan</p>
      </div>
      <Faqs />
    </div>
  );
}
