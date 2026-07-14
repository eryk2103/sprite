using System.Net;
using System.Net.Http.Json;
using WebAPI.Models;

namespace WebAPI.Tests.Integration;

[Collection(IntegrationTestCollection.Name)]
public class ProjectsEndpointsTests(WebApiFactory factory) : IntegrationTestBase(factory)
{
    [Fact]
    public async Task GetAllProjects_ReturnsUnauthorized_WhenNotLoggedIn()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/projects");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateProject_ReturnsCreatedProject()
    {
        var client = await CreateAuthenticatedClientAsync();

        var project = await CreateProjectAsync(client, "My Project");

        Assert.Equal("My Project", project.Name);
        Assert.True(project.Id > 0);
    }

    [Fact]
    public async Task CreateProject_DuplicateName_ReturnsConflict()
    {
        var client = await CreateAuthenticatedClientAsync();
        await CreateProjectAsync(client, "Duplicate Name");

        var response = await client.PostAsJsonAsync("/api/projects", new { name = "Duplicate Name" });

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task GetProject_ReturnsNotFound_ForAnotherUsersProject()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(owner, "Owner's Project");

        var otherUser = await CreateAuthenticatedClientAsync();
        var response = await otherUser.GetAsync($"/api/projects/{project.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetProject_ReturnsNestedGroupsAndSprites()
    {
        var client = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(client, "Project With Groups");
        var group = await CreateGroupAsync(client, project.Id, "Group A");
        await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Hero", data = "[]" });

        var response = await client.GetAsync($"/api/projects/{project.Id}");
        var detail = await response.Content.ReadFromJsonAsync<ProjectDetailDto>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(detail);
        Assert.Single(detail!.Groups);
        Assert.Equal("Group A", detail.Groups[0].Name);
        Assert.Single(detail.Groups[0].Sprites);
        Assert.Equal("Hero", detail.Groups[0].Sprites[0].Name);
    }

    [Fact]
    public async Task UpdateProject_RenamesProject()
    {
        var client = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(client, "Old Name");

        var response = await client.PutAsJsonAsync($"/api/projects/{project.Id}", new { name = "New Name" });
        var updated = await response.Content.ReadFromJsonAsync<ProjectDto>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("New Name", updated!.Name);
    }

    [Fact]
    public async Task UpdateProject_ReturnsNotFound_ForAnotherUsersProject()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(owner, "Owner's Project 2");

        var otherUser = await CreateAuthenticatedClientAsync();
        var response = await otherUser.PutAsJsonAsync($"/api/projects/{project.Id}", new { name = "Hijacked" });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteProject_RemovesProject()
    {
        var client = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(client, "To Be Deleted");

        var deleteResponse = await client.DeleteAsync($"/api/projects/{project.Id}");
        var getResponse = await client.GetAsync($"/api/projects/{project.Id}");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task GetAllProjects_RespectsPagination()
    {
        var client = await CreateAuthenticatedClientAsync();
        await CreateProjectAsync(client, "Page Project A");
        await CreateProjectAsync(client, "Page Project B");
        await CreateProjectAsync(client, "Page Project C");

        var firstPageResponse = await client.GetAsync("/api/projects?page=1&pageSize=2");
        var firstPage = await firstPageResponse.Content.ReadFromJsonAsync<PagedResult<ProjectDto>>();

        var secondPageResponse = await client.GetAsync("/api/projects?page=2&pageSize=2");
        var secondPage = await secondPageResponse.Content.ReadFromJsonAsync<PagedResult<ProjectDto>>();

        Assert.Equal(2, firstPage!.Items.Count);
        Assert.Equal(3, firstPage.TotalCount);
        Assert.Single(secondPage!.Items);
        Assert.Equal(3, secondPage.TotalCount);
    }
}
