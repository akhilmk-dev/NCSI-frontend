import api from "../utils/axiosInstance";

export const getHierarchyPage = async () => {
  try {
    const response = await api.get("/V1/hierarchypage");
    const data = response.data.data;

    return {
      achievements: data.achievments?.items || [],
      baseUrls: {
        achievements: data.achievments?.base_url || "",
        org: data.orgchart?.base_url || "",
      },
      orgMembers: data.orgchart?.items || [],
    };
  } catch (error) {
    console.error("Error fetching hierarchy data:", error);
    return {
      achievements: [],
      baseUrls: { achievements: "", org: "" },
      orgMembers: [],
    };
  }
};
