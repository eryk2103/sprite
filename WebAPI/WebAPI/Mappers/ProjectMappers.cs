using WebAPI.Models;

namespace WebAPI.Mappers;

public static class ProjectMappers
{
    public static ProjectDto ToDto(this Project project) => new()
    {
        Id = project.Id,
        Name = project.Name
    };

    public static ProjectDetailDto ToDetailDto(this Project project) => new()
    {
        Id = project.Id,
        Name = project.Name,
        Groups = project.Groups.Select(g => g.ToDto()).ToList()
    };
}
