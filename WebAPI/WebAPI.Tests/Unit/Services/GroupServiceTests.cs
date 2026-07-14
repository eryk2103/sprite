using Moq;
using WebAPI.Data;
using WebAPI.Data.Repositories;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Tests.Unit.Services;

public class GroupServiceTests
{
    private readonly Mock<IGroupRepository> _groupRepository = new();
    private readonly Mock<IProjectRepository> _projectRepository = new();
    private readonly Mock<IPersistenceContext> _persistenceContext = new();
    private readonly GroupService _sut;

    public GroupServiceTests()
    {
        _sut = new GroupService(_groupRepository.Object, _projectRepository.Object, _persistenceContext.Object);
    }

    [Fact]
    public async Task CreateAsync_ReturnsNull_WhenProjectNotOwnedByUser()
    {
        _projectRepository
            .Setup(r => r.ExistsForUserAsync(1, "user-1"))
            .ReturnsAsync(false);

        var result = await _sut.CreateAsync("user-1", new CreateGroupDto { Name = "Group A", ProjectId = 1 });

        Assert.Null(result);
        _groupRepository.Verify(r => r.Add(It.IsAny<Group>()), Times.Never);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task CreateAsync_AddsGroup_WhenProjectOwnedByUser()
    {
        _projectRepository
            .Setup(r => r.ExistsForUserAsync(1, "user-1"))
            .ReturnsAsync(true);

        var result = await _sut.CreateAsync("user-1", new CreateGroupDto { Name = "Group A", ProjectId = 1 });

        Assert.NotNull(result);
        Assert.Equal("Group A", result!.Name);
        Assert.Empty(result.Sprites);
        _groupRepository.Verify(r => r.Add(It.Is<Group>(g => g.Name == "Group A" && g.ProjectId == 1)), Times.Once);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenGroupNotFound()
    {
        _groupRepository
            .Setup(r => r.GetWithSpritesForUserAsync(1, "user-1"))
            .ReturnsAsync((Group?)null);

        var result = await _sut.UpdateAsync(1, "user-1", new UpdateGroupDto { Name = "Renamed" });

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_RenamesGroup_WhenFound()
    {
        var group = new Group { Id = 1, Name = "Old", ProjectId = 1 };
        _groupRepository
            .Setup(r => r.GetWithSpritesForUserAsync(1, "user-1"))
            .ReturnsAsync(group);

        var result = await _sut.UpdateAsync(1, "user-1", new UpdateGroupDto { Name = "New" });

        Assert.Equal("New", result!.Name);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenGroupNotFound()
    {
        _groupRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync((Group?)null);

        var result = await _sut.DeleteAsync(1, "user-1");

        Assert.False(result);
    }

    [Fact]
    public async Task DeleteAsync_RemovesGroup_WhenFound()
    {
        var group = new Group { Id = 1, Name = "Group A", ProjectId = 1 };
        _groupRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync(group);

        var result = await _sut.DeleteAsync(1, "user-1");

        Assert.True(result);
        _groupRepository.Verify(r => r.Remove(group), Times.Once);
    }
}
