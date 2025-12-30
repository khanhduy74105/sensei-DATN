import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";
import { ICoverLetter } from "@/types";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditCoverLetterPage({ params }: Props) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  const headerLetter = (letter: ICoverLetter) => {
    let header = `Cover Letter: ${letter.title} at ${letter.companyName}`;

    switch (letter.type) {
      case "application":
        header = `Application Cover Letter: ${letter.title} at ${letter.companyName}`;
        break;
      case "prospecting":
        header = `Prospecting Cover Letter: About ${letter.title} at ${letter.companyName}`;
        break;
      case "referral":
        header = `Referral Cover Letter: ${letter.title} at ${letter.companyName}`;
        break;
      case "thankyou":
        header = `Thank You Letter: ${letter.recipient} at ${letter.companyName}`;
        break;
    }
    return header;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <h1 className="text-6xl font-bold gradient-title mb-6">
          {headerLetter(coverLetter!)}
        </h1>
      </div>

      <CoverLetterPreview coverLetter={coverLetter} />
    </div>
  );
}
