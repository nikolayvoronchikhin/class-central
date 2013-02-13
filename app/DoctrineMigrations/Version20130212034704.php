<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration,
    Doctrine\DBAL\Schema\Schema;

/**
 * Adding columns to streams table to assist in navigation by stream
 */
class Version20130212034704 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        // this up() migration is autogenerated, please modify it to your needs
        $streams = $schema->getTable("streams");
        $streams->addColumn('slug', 'string',array('notNull'=> false));
        $streams->addColumn('show_in_nav',"boolean",array('notNull' => false));
        
    }

    public function down(Schema $schema)
    {
        // this down() migration is autogenerated, please modify it to your needs

    }
}