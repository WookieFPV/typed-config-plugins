export const cleanupGitHubUrl = (url: string) => {
    const urlParts = url.split("/");

    const [https, github, com, user, repo, ...other] = urlParts;
    return [...[https, github, com, user, repo].map((i) => i?.toLowerCase() ?? ""), ...other].join("/");
};
