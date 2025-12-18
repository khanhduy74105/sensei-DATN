import React from "react";
import { IResumeProject } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CardProject = ({ item }: { item?: IResumeProject }) => {
  return item ? (
    <Card className="gap-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
          <span className="text-sm font-normal text-neutral-300">
            {item.type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mt-2 text-sm whitespace-pre-wrap text-ellipsis overflow-hidden">
          {item.description}
        </p>
      </CardContent>
    </Card>
  ) : <></>;
};

export default CardProject;
