import { OrganizationList } from "@clerk/nextjs";

export default function createOrganizationPage() {
  return (
    <OrganizationList
        afterCreateOrganizationUrl={'/'}
        afterSelectOrganizationUrl={'/'}
     />
  );
}