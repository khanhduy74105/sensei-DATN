import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { IResumeEducation } from "../types";

const CardEducation = ({ item }: { item?: IResumeEducation }) => {
  return item ? (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div>
            <CardTitle className="text-sm font-medium">
              {item.field} - {item.degree}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{item.institution}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          Graduation date: {item.graduationDate}
        </p>
        <p className="mt-1 text-sm">GPA: {item.gpa}</p>
      </CardContent>
    </Card>
  ) : <></>;
};

export default CardEducation;
