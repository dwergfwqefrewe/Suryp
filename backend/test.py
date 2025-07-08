some = [
  {
    "companion_id": 12
  },
  {
    "companion_id": 14
  },
  {
    "companion_id": 14
  },
  {
    "companion_id": 14
  }
]

print(set([chat["companion_id"] for chat in some]))

