"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomInfiniteScroll from "../CustomInfiniteScroll";
import { getCompanies } from "@/actions/getCompanies";

type Company = {
  id: string;
  name: string;
  logo: string | null;
  works: { name: string }[];
};

export const CompaniesList = () => {
  const [companies, setCompanies] = React.useState<Company[]>([]);

  return (
    <CustomInfiniteScroll
      setData={setCompanies}
      getAction={getCompanies}
    >
      <>
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </>
    </CustomInfiniteScroll>
  );
};

export const CompanyCard = ({ company }: { company: Company }) => {
  return (
    <Card
      size="sm"
      className="mx-auto w-full max-w-sm aspect-video rounded-xl bg-muted/50"
    >
      <CardHeader>
        <Avatar className="h-8 w-8 rounded-lg">
          {company.logo && (
            <AvatarImage
              src={"/api/images/" + company.logo}
              alt={company.name}
            />
          )}
          <AvatarFallback className="rounded-lg">
            {company.name.at(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{company.name}</CardTitle>
        <CardDescription>
          {company.works?.map((w) => w.name).join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>{company.name}</CardContent>
    </Card>
  );
};
