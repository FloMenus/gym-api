import { Badge, PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import type { badgeType } from "../schemas";
import { CronJob } from "cron";

export class BadgeService {
  db: PrismaClient;
  cron: CronJob;

  constructor() {
    this.db = prisma;
    this.cron = new CronJob(
      "0 0 * * *",
      async () => {
        await this.execute();
      },
      null,
      true,
      "Europe/Paris"
    );
  }

  async getAll() {
    const badges = await this.db.badge.findMany();

    return {
      success: true,
      badges,
    };
  }

  async get(id: number) {
    const badge = await this.db.badge.findUnique({
      where: { id },
    });

    if (!badge) {
      return {
        success: false,
        message: "Badge introuvable.",
      };
    }

    return {
      success: true,
      badge,
    };
  }

  async getByUser(id: number) {
    const badges = await this.db.userBadge.findMany({
      where: {
        userId: id,
      },
      select: {
        wonAt: true,
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        wonAt: "desc",
      },
    });

    return {
      success: true,
      badges,
    };
  }

  async create(data: badgeType) {
    const badge = await this.db.badge.create({
      data,
    });

    return {
      success: true,
      message: "Badge créé.",
      badge,
    };
  }

  async update(id: number, data: badgeType) {
    const badgeExist = await this.db.badge.findFirst({
      where: { id },
    });

    if (!badgeExist) {
      return {
        success: false,
        message: "Badge introuvable.",
      };
    }

    const badge = await this.db.badge.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: "Badge modifié.",
      badge,
    };
  }

  async delete(id: number) {
    const badgeExist = await this.db.badge.findFirst({
      where: { id },
    });

    if (!badgeExist) {
      return {
        success: false,
        message: "Badge introuvable.",
      };
    }

    await this.db.badge.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Badge supprimé.",
    };
  }

  async execute() {
    const badges = await this.db.badge.findMany();

    for (const badge of badges) {
      const userIds = await this.dispatch(badge);

      if (userIds.length > 0) {
        await this.giveBadge(badge.id, userIds);
      }
    }

    return {
      success: true,
      message: "Exection effectuée.",
    };
  }

  private async dispatch(badge: Badge): Promise<number[]> {
    switch (badge.type) {
      case "CALORIES":
        return this.calories(badge);

      case "CHALLENGES":
        return this.challenges(badge);

      case "SESSIONS":
        return this.sessions(badge);

      default:
        return [];
    }
  }

  private async calories(badge: Badge) {
    const users = await this.db.trainingSession.groupBy({
      by: ["userId"],
      where: {
        calories: {
          not: null,
        },
        user: {
          userBadges: {
            none: {
              badgeId: badge.id,
            },
          },
        },
      },
      _sum: {
        calories: true,
      },
      having: {
        calories: {
          _sum: {
            gte: badge.value,
          },
        },
      },
    });

    return users.map((u) => u.userId);
  }

  private async challenges(badge: Badge) {
    const users = await this.db.challengeParticipation.groupBy({
      by: ["userId"],
      where: {
        completedAt: {
          not: null,
        },
        user: {
          userBadges: {
            none: {
              badgeId: badge.id,
            },
          },
        },
      },
      _count: {
        id: true,
      },
      having: {
        id: {
          _count: {
            gte: badge.value,
          },
        },
      },
    });

    return users.map((u) => u.userId);
  }

  private async sessions(badge: Badge) {
    const users = await this.db.trainingSession.groupBy({
      by: ["userId"],
      where: {
        user: {
          userBadges: {
            none: {
              badgeId: badge.id,
            },
          },
        },
      },
      _count: {
        id: true,
      },
      having: {
        id: {
          _count: {
            gte: badge.value,
          },
        },
      },
    });

    return users.map((u) => u.userId);
  }

  private async giveBadge(badgeId: number, users: number[]) {
    for (const userId of users) {
      await this.db.userBadge.create({
        data: {
          userId,
          badgeId,
          wonAt: new Date(),
        },
      });
    }
  }
}
