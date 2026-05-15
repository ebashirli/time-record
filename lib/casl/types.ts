import {
  CheckinScalarFieldEnum,
  CompanyScalarFieldEnum,
  DepartmentScalarFieldEnum,
  EmployeeScalarFieldEnum,
  PositionScalarFieldEnum,
  WorkScalarFieldEnum,
} from "@/prisma/lib/generated/prisma/internal/prismaNamespace";
import { DefaultArgs } from "@prisma/client/runtime/client";
import {
  CheckinInclude,
  CheckinOmit,
  CheckinOrderByWithRelationInput,
  CheckinSelect,
  CheckinWhereInput,
  CheckinWhereUniqueInput,
  CompanyInclude,
  CompanyOmit,
  CompanyOrderByWithRelationInput,
  CompanySelect,
  CompanyWhereInput,
  CompanyWhereUniqueInput,
  DepartmentInclude,
  DepartmentOmit,
  DepartmentOrderByWithRelationInput,
  DepartmentSelect,
  DepartmentWhereInput,
  DepartmentWhereUniqueInput,
  EmployeeInclude,
  EmployeeOmit,
  EmployeeOrderByWithRelationInput,
  EmployeeSelect,
  EmployeeWhereInput,
  EmployeeWhereUniqueInput,
  PositionInclude,
  PositionOmit,
  PositionOrderByWithRelationInput,
  PositionSelect,
  PositionWhereInput,
  PositionWhereUniqueInput,
  WorkInclude,
  WorkOmit,
  WorkOrderByWithRelationInput,
  WorkSelect,
  WorkWhereInput,
  WorkWhereUniqueInput,
} from "@/prisma/lib/generated/prisma/models";

export type EmployeeArgs = {
  select?: EmployeeSelect<DefaultArgs> | null | undefined;
  omit?: EmployeeOmit<DefaultArgs> | null | undefined;
  include?: EmployeeInclude<DefaultArgs> | null | undefined;
  where?: EmployeeWhereInput;
  orderBy?:
    | EmployeeOrderByWithRelationInput
    | EmployeeOrderByWithRelationInput[];
  cursor?: EmployeeWhereUniqueInput;
  take?: number;
  skip?: number;
  distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[];
};

export type WorkArgs = {
  select?: WorkSelect<DefaultArgs> | null | undefined;
  omit?: WorkOmit<DefaultArgs> | null | undefined;
  include?: WorkInclude<DefaultArgs> | null | undefined;
  where?: WorkWhereInput;
  orderBy?: WorkOrderByWithRelationInput | WorkOrderByWithRelationInput[];
  cursor?: WorkWhereUniqueInput;
  take?: number;
  skip?: number;
  distinct?: WorkScalarFieldEnum | WorkScalarFieldEnum[];
};

export type CheckinArgs = {
  select?: CheckinSelect<DefaultArgs> | null | undefined;
  omit?: CheckinOmit<DefaultArgs> | null | undefined;
  include?: CheckinInclude<DefaultArgs> | null | undefined;
  where?: CheckinWhereInput;
  orderBy?: CheckinOrderByWithRelationInput | CheckinOrderByWithRelationInput[];
  cursor?: CheckinWhereUniqueInput;
  take?: number;
  skip?: number;
  distinct?: CheckinScalarFieldEnum | CheckinScalarFieldEnum[];
};

export type CompanyArgs = {
  select?: CompanySelect<DefaultArgs> | null | undefined;
  omit?: CompanyOmit<DefaultArgs> | null | undefined;
  include?: CompanyInclude<DefaultArgs> | null | undefined;
  where?: CompanyWhereInput;
  orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[];
  cursor?: CompanyWhereUniqueInput;
  take?: number;
  skip?: number;
  distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[];
};

export type DepartmentArgs = {
  select?: DepartmentSelect<DefaultArgs> | null | undefined;
  omit?: DepartmentOmit<DefaultArgs> | null | undefined;
  include?: DepartmentInclude<DefaultArgs> | null | undefined;
  where?: DepartmentWhereInput;
  orderBy?:
    | DepartmentOrderByWithRelationInput
    | DepartmentOrderByWithRelationInput[];
  cursor?: DepartmentWhereUniqueInput;
  take?: number;
  skip?: number;
  distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[];
};

export type PositionArgs = {
  select?: PositionSelect<DefaultArgs> | null | undefined;
  omit?: PositionOmit<DefaultArgs> | null | undefined;
  include?: PositionInclude<DefaultArgs> | null | undefined;
  where?: PositionWhereInput;
  orderBy?:
    | PositionOrderByWithRelationInput
    | PositionOrderByWithRelationInput[];
  cursor?: PositionWhereUniqueInput;
  take?: number;
  skip?: number;
  distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[];
};
