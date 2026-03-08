const CollectionPublic = Object.freeze({
  PRIVATE: 0,
  PUBLIC: 1,

  all() {
    return [
      this.PRIVATE,
      this.PUBLIC,
    ]
  },
})

export default CollectionPublic;