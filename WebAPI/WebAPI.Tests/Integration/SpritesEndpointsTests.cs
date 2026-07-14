using System.Net;
using System.Net.Http.Json;
using WebAPI.Models;

namespace WebAPI.Tests.Integration;

[Collection(IntegrationTestCollection.Name)]
public class SpritesEndpointsTests(WebApiFactory factory) : IntegrationTestBase(factory)
{
    private async Task<(HttpClient Client, GroupDto Group)> CreateClientWithGroupAsync()
    {
        var client = await CreateAuthenticatedClientAsync();
        var project = await CreateProjectAsync(client, $"Sprite Test Project {Guid.NewGuid():N}");
        var group = await CreateGroupAsync(client, project.Id, "Sprite Test Group");
        return (client, group);
    }

    [Fact]
    public async Task CreateSprite_ReturnsCreatedSprite()
    {
        var (client, group) = await CreateClientWithGroupAsync();

        var response = await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Hero", data = "[]" });
        var sprite = await response.Content.ReadFromJsonAsync<SpriteDto>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Hero", sprite!.Name);
    }

    [Fact]
    public async Task CreateSprite_ReturnsNotFound_WhenGroupNotOwnedByUser()
    {
        var (_, group) = await CreateClientWithGroupAsync();

        var otherUser = await CreateAuthenticatedClientAsync();
        var response = await otherUser.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Sneaky Sprite", data = "[]" });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateSprite_DuplicateNameInSameGroup_ReturnsConflict()
    {
        var (client, group) = await CreateClientWithGroupAsync();
        await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Duplicate Sprite", data = "[]" });

        var response = await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Duplicate Sprite", data = "[]" });

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task CreateSprite_OversizedData_ReturnsBadRequest()
    {
        var (client, group) = await CreateClientWithGroupAsync();
        var oversizedData = new string('x', 250_000);

        var response = await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Too Big", data = oversizedData });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSprite_ReturnsSpriteWithData()
    {
        var (client, group) = await CreateClientWithGroupAsync();
        var createResponse = await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Hero", data = "[[\"#fff\"]]" });
        var created = await createResponse.Content.ReadFromJsonAsync<SpriteDto>();

        var response = await client.GetAsync($"/api/sprites/{created!.Id}");
        var detail = await response.Content.ReadFromJsonAsync<SpriteDetailDto>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("[[\"#fff\"]]", detail!.Data);
    }

    [Fact]
    public async Task UpdateSprite_UpdatesData()
    {
        var (client, group) = await CreateClientWithGroupAsync();
        var createResponse = await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Hero", data = "[]" });
        var created = await createResponse.Content.ReadFromJsonAsync<SpriteDto>();

        var updateResponse = await client.PutAsJsonAsync($"/api/sprites/{created!.Id}", new { data = "[[\"#000000\"]]" });
        var getResponse = await client.GetAsync($"/api/sprites/{created.Id}");
        var detail = await getResponse.Content.ReadFromJsonAsync<SpriteDetailDto>();

        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        Assert.Equal("[[\"#000000\"]]", detail!.Data);
    }

    [Fact]
    public async Task RenameSprite_RenamesSprite()
    {
        var (client, group) = await CreateClientWithGroupAsync();
        var createResponse = await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "Old Name", data = "[]" });
        var created = await createResponse.Content.ReadFromJsonAsync<SpriteDto>();

        var response = await client.PutAsJsonAsync($"/api/sprites/{created!.Id}/rename", new { name = "New Name" });
        var renamed = await response.Content.ReadFromJsonAsync<SpriteDto>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("New Name", renamed!.Name);
    }

    [Fact]
    public async Task DeleteSprite_RemovesSprite()
    {
        var (client, group) = await CreateClientWithGroupAsync();
        var createResponse = await client.PostAsJsonAsync("/api/sprites", new { groupId = group.Id, name = "To Delete", data = "[]" });
        var created = await createResponse.Content.ReadFromJsonAsync<SpriteDto>();

        var deleteResponse = await client.DeleteAsync($"/api/sprites/{created!.Id}");
        var getResponse = await client.GetAsync($"/api/sprites/{created.Id}");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }
}
