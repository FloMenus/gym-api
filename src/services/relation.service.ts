import type { FriendRequest, PrismaClient } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { editRelationType, relationType } from "../schemas";

type FriendRequestWithUsers = FriendRequest & {
  sender: {
    id: number;
    name: string;
    email: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
  };
};

export class RelationService {
  db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  relations = (friendRequests: FriendRequestWithUsers[], userId: number) => {
    return friendRequests.map((fr) => {
      const isSender = fr.senderId === userId;

      return {
        user: isSender ? fr.receiver : fr.sender,
        status: fr.status,
        requestId: fr.id,
        isSender, // optionnel mais souvent utile côté front
      };
    });
  };

  async getRelation(userId: number) {
    const friendsRelations = await this.db.friendRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const relations = this.relations(friendsRelations, userId);

    return {
      success: true,
      relations,
    };
  }

  async getAcceptRelation(userId: number) {
    const friendsRelations = await this.db.friendRequest.findMany({
      where: {
        status: "ACCEPT",
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const relations = this.relations(friendsRelations, userId);

    return {
      success: true,
      relations,
    };
  }

  async getPendingRelation(userId: number) {
    const friendsRelations = await this.db.friendRequest.findMany({
      where: {
        status: "PENDING",
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const relations = this.relations(friendsRelations, userId);

    return {
      success: true,
      relations,
    };
  }

  async send(userId: number, data: relationType) {
    const { email } = data;

    const userReceiver = await this.db.user.findFirst({
      where: { email },
    });

    if (!userReceiver) {
      return {
        success: false,
        message: "Utilisateur introuvable.",
      };
    }

    const requestExist = await this.db.friendRequest.findFirst({
      where: {
        receiverId: userReceiver.id,
        senderId: userId,
      },
    });

    if (requestExist) {
      return {
        success: false,
        message: "Demande déjà existante.",
      };
    }

    const request = await this.db.friendRequest.create({
      data: {
        receiverId: userReceiver.id,
        senderId: userId,
      },
    });

    return {
      success: true,
      message: "Demande envoyée.",
      request,
    };
  }

  async edit(userId: number, data: editRelationType) {
    const { email, status } = data;

    const userReceiver = await this.db.user.findFirst({
      where: { email },
    });

    if (!userReceiver) {
      return {
        success: false,
        message: "Utilisateur introuvable.",
      };
    }

    const request = await this.db.friendRequest.findFirst({
      where: {
        receiverId: userId,
        sender: {
          email,
        },
      },
    });

    if (!request) {
      return {
        success: false,
        message: "Vous n'avez aucune demande de cet utilisateur.",
      };
    }

    if (status === "ACCEPT") {
      const requestUpdate = await this.db.friendRequest.update({
        data: {
          status: "ACCEPT",
        },
        where: { id: request.id },
      });

      return {
        success: true,
        message: "Demande d'ami acceptée !",
      };
    } else {
      await this.db.friendRequest.delete({
        where: {
          id: request.id,
        },
      });

      return {
        success: true,
        message: "Demande d'ami rejetée.",
      };
    }
  }

  async delete(userId: number, data: relationType) {
    const { email } = data;

    const userReceiver = await this.db.user.findFirst({
      where: { email },
    });

    if (!userReceiver) {
      return {
        success: false,
        message: "Utilisateur introuvable.",
      };
    }

    const relation = await this.db.friendRequest.findFirst({
      where: {
        OR: [
          {
            AND: [{ receiverId: userId }, { sender: { email } }],
          },
          { AND: [{ receiver: { email } }, { senderId: userId }] },
        ],
      },
    });

    if (!relation) {
      return {
        success: false,
        message: "Vous n'avez pas de relation avec cet utilisateur.",
      };
    }

    await this.db.friendRequest.delete({
      where: {
        id: relation.id,
      },
    });

    return {
      success: true,
      message: "Ami supprimé.",
    };
  }
}
