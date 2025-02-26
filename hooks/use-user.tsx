import { useOrganization, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface UseCurrentIdsReturn {
  currentUserId: string | null;
  currentOrgId: string | null;
  setCurrentUserId: (id: string | null) => void;
  setCurrentOrgId: (id: string | null) => void;
}

export function useCurrentIds(): UseCurrentIdsReturn {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  
  const { user } = useUser();
  const { organization } = useOrganization();

  useEffect(() => {
    if (user?.id && !currentUserId) {
      setCurrentUserId(user.id);
    }
  }, [user?.id, currentUserId]);

  useEffect(() => {
    if (organization?.id && !currentOrgId) {
      setCurrentOrgId(organization.id);
    }
  }, [organization?.id, currentOrgId]);

  return {
    currentUserId,
    currentOrgId,
    setCurrentUserId,
    setCurrentOrgId
  };
}