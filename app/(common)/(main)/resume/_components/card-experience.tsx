import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IResumeExperience } from "../types";
import { formatDisplayDate } from "./entry-form";

export default function CardExperience({
  item,
}: {
  item: IResumeExperience | undefined;
}) {

  return item ? (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">
            {item.title} @ {item.organization}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {item.isCurrent
            ? `${formatDisplayDate(item.startDate)} - Present`
            : `${formatDisplayDate(item.startDate)} - ${formatDisplayDate(
                item.endDate
              )}`}
        </p>
        <p className="mt-2 text-sm whitespace-pre-wrap text-ellipsis overflow-hidden">
          {item.description}
        </p>
      </CardContent>
    </Card>
  ) : <></>;
}
