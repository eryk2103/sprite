using Moq;
using WebAPI.Data;
using WebAPI.Data.Repositories;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Tests.Unit.Services;

public class SpriteServiceTests
{
    private readonly Mock<ISpriteRepository> _spriteRepository = new();
    private readonly Mock<IGroupRepository> _groupRepository = new();
    private readonly Mock<IPersistenceContext> _persistenceContext = new();
    private readonly SpriteService _sut;

    public SpriteServiceTests()
    {
        _sut = new SpriteService(_spriteRepository.Object, _groupRepository.Object, _persistenceContext.Object);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenSpriteNotFound()
    {
        _spriteRepository
            .Setup(r => r.GetDetailForUserAsync(1, "user-1"))
            .ReturnsAsync((Sprite?)null);

        var result = await _sut.GetByIdAsync(1, "user-1");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsDetailDto_WhenFound()
    {
        var sprite = new Sprite { Id = 1, Name = "Hero", Data = "[]", GroupId = 1 };
        _spriteRepository
            .Setup(r => r.GetDetailForUserAsync(1, "user-1"))
            .ReturnsAsync(sprite);

        var result = await _sut.GetByIdAsync(1, "user-1");

        Assert.NotNull(result);
        Assert.Equal("Hero", result!.Name);
        Assert.Equal("[]", result.Data);
    }

    [Fact]
    public async Task CreateAsync_ReturnsNull_WhenGroupNotOwnedByUser()
    {
        _groupRepository
            .Setup(r => r.ExistsForUserAsync(1, "user-1"))
            .ReturnsAsync(false);

        var result = await _sut.CreateAsync("user-1", new CreateSpriteDto { GroupId = 1, Name = "Hero", Data = "[]" });

        Assert.Null(result);
        _spriteRepository.Verify(r => r.Add(It.IsAny<Sprite>()), Times.Never);
    }

    [Fact]
    public async Task CreateAsync_AddsSprite_WhenGroupOwnedByUser()
    {
        _groupRepository
            .Setup(r => r.ExistsForUserAsync(1, "user-1"))
            .ReturnsAsync(true);

        var result = await _sut.CreateAsync("user-1", new CreateSpriteDto { GroupId = 1, Name = "Hero", Data = "[]" });

        Assert.NotNull(result);
        Assert.Equal("Hero", result!.Name);
        _spriteRepository.Verify(r => r.Add(It.Is<Sprite>(s => s.Name == "Hero" && s.GroupId == 1 && s.Data == "[]")), Times.Once);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenSpriteNotFound()
    {
        _spriteRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync((Sprite?)null);

        var result = await _sut.UpdateAsync(1, "user-1", new UpdateSpriteDto { Data = "[]" });

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesData_WhenFound()
    {
        var sprite = new Sprite { Id = 1, Name = "Hero", Data = "old", GroupId = 1 };
        _spriteRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync(sprite);

        var result = await _sut.UpdateAsync(1, "user-1", new UpdateSpriteDto { Data = "new" });

        Assert.NotNull(result);
        Assert.Equal("new", sprite.Data);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task RenameAsync_ReturnsNull_WhenSpriteNotFound()
    {
        _spriteRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync((Sprite?)null);

        var result = await _sut.RenameAsync(1, "user-1", new RenameSpriteDto { Name = "New Name" });

        Assert.Null(result);
    }

    [Fact]
    public async Task RenameAsync_RenamesSprite_WhenFound()
    {
        var sprite = new Sprite { Id = 1, Name = "Old", Data = "[]", GroupId = 1 };
        _spriteRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync(sprite);

        var result = await _sut.RenameAsync(1, "user-1", new RenameSpriteDto { Name = "New" });

        Assert.Equal("New", result!.Name);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenSpriteNotFound()
    {
        _spriteRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync((Sprite?)null);

        var result = await _sut.DeleteAsync(1, "user-1");

        Assert.False(result);
    }

    [Fact]
    public async Task DeleteAsync_RemovesSprite_WhenFound()
    {
        var sprite = new Sprite { Id = 1, Name = "Hero", Data = "[]", GroupId = 1 };
        _spriteRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync(sprite);

        var result = await _sut.DeleteAsync(1, "user-1");

        Assert.True(result);
        _spriteRepository.Verify(r => r.Remove(sprite), Times.Once);
    }
}
