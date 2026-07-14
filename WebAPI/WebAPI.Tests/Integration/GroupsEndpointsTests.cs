using System.Net;
using System.Net.Http.Json;
using WebAPI.Models;

namespace WebAPI.Tests.Integration;

[Collection(IntegrationTestCollection.Name)]
public class GroupsEndpointsTests(WebApiFactory factory) : IntegrationTestBase(factory)
{
    [Fact]
    public async Task CreateGroup_ReturnsCreatedGroup()
    {
        var client = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(client, "Group Test Project");

        var group = await CreateGroupAsync(client, project.Id, "Group A");

        Assert.Equal("Group A", group.Name);
        Assert.Empty(group.Sprites);
    }

    [Fact]
    public async Task CreateGroup_ReturnsNotFound_WhenProjectNotOwnedByUser()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(owner, "Owner Only Project");

        var otherUser = await CreateAuthenticatedClientAsync();
        var response = await otherUser.PostAsJsonAsync("/api/groups", new { name = "Sneaky Group", projectId = project.Id });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateGroup_DuplicateNameInSameProject_ReturnsConflict()
    {
        var client = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(client, "Dup Group Project");
        await CreateGroupAsync(client, project.Id, "Duplicate Group");

        var response = await client.PostAsJsonAsync("/api/groups", new { name = "Duplicate Group", projectId = project.Id });

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task UpdateGroup_RenamesGroup()
    {
        var client = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(client, "Rename Group Project");
        var group = await CreateGroupAsync(client, project.Id, "Old Group Name");

        var response = await client.PutAsJsonAsync($"/api/groups/{group.Id}", new { name = "New Group Name" });
        var updated = await response.Content.ReadFromJsonAsync<GroupDto>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("New Group Name", updated!.Name);
    }

    [Fact]
    public async Task DeleteGroup_RemovesGroup()
    {
        var client = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(client, "Delete Group Project");
        var group = await CreateGroupAsync(client, project.Id, "Group To Delete");

        var deleteResponse = await client.DeleteAsync($"/api/groups/{group.Id}");
        var projectResponse = await client.GetAsync($"/api/projects/{project.Id}");
        var projectDetail = await projectResponse.Content.ReadFromJsonAsync<ProjectDetailDto>();

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.Empty(projectDetail!.Groups);
    }

    [Fact]
    public async Task DeleteGroup_ReturnsNotFound_WhenGroupNotOwnedByUser()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(owner, "Owner Group Project");
        var group = await CreateGroupAsync(owner, project.Id, "Owner Group");

        var otherUser = await CreateAuthenticatedClientAsync();
        var response = await otherUser.DeleteAsync($"/api/groups/{group.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
